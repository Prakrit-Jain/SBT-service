import tokenRepository from '../repositories/token.repository';
import userRepository from '../repositories/user.repositry';
import relayerService from './relayer.service';
import {
  IssueTokenRequest,
  IssueTokenResponse,
  CheckTokenRequest,
  CheckTokenResponse,
  MintRewardTokenRequest,
  MintRewardTokenResponse,
  DelegateTokenRequest,
  DelegateTokenResponse,
} from '../types/api.types';
import { TokenType, TokenStatus } from '../types/database.types';
import { REWARD_TOKEN_TYPES } from '../utils/constant';
import { NotFoundError, BadRequestError } from '../utils/api-error';

class TokenService {
  async issueToken(request: IssueTokenRequest): Promise<IssueTokenResponse> {
    const user = await userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError(`User ${request.userId} not found`);
    }

    if (user.walletAddress.toLowerCase() !== request.walletAddress.toLowerCase()) {
      throw new BadRequestError('Wallet address does not match user record');
    }

    const relayerResponse = await relayerService.registerToken({
      hid: request.hid,
      himei: request.himei,
      mcc: request.mcc,
      mnc: request.mnc,
      owner: request.walletAddress,
      distributor: request.distributor,
      sig: request.sig,
      leaf: request.leaf,
      proof: request.proof,
      fid: request.fid,
      bid: request.bid,
      mid: request.mid,
      blockchain: request.blockchain,
    });

    const token = await tokenRepository.create({
      tokenId: relayerResponse.tokenid.toString(),
      userId: request.userId,
      walletAddress: request.walletAddress.toLowerCase(),
      tokenType: TokenType.SOULBOUND,
      blockchain: relayerResponse.chain,
      contractAddress: relayerResponse.sbtaddr,
      imageUrl: relayerResponse.image,
      status: TokenStatus.MINTED,
      metadata: {
        mcc: request.mcc,
        mnc: request.mnc,
        distributor: request.distributor,
        mid: request.mid,
      },
    });

    return {
      success: true,
      data: {
        tokenId: token.tokenId,
        walletAddress: token.walletAddress,
        blockchain: token.blockchain,
        contractAddress: token.contractAddress,
        imageUrl: token.imageUrl || '',
        timestamp: token.createdAt,
      },
      message: 'Token issued successfully',
    };
  }

  async checkToken(request: CheckTokenRequest): Promise<CheckTokenResponse> {
    const balance = await relayerService.checkTokenBalance(
      request.blockchain,
      request.walletAddress,
      request.isDelegated
    );

    const verified = balance > 0;

    return {
      success: true,
      data: {
        walletAddress: request.walletAddress,
        blockchain: request.blockchain,
        balance,
        verified,
      },
      message: verified ? 'Token verified successfully' : 'No token found',
    };
  }

  async mintRewardToken(request: MintRewardTokenRequest): Promise<MintRewardTokenResponse> {
    const user = await userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError(`User ${request.userId} not found`);
    }

    const tokenTypeCode =
      request.tokenType === 'VCT' ? REWARD_TOKEN_TYPES.VCT : REWARD_TOKEN_TYPES.WCT;

    const relayerResponse = await relayerService.mintRewardToken({
      token: tokenTypeCode,
      toaddress: request.recipients.map((r) => r.address),
      amount: request.recipients.map((r) => r.amount),
      blockchain: request.blockchain,
    });

    await Promise.all(
      request.recipients.map((recipient) =>
        tokenRepository.create({
          tokenId: `${relayerResponse.chain}-${request.tokenType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: request.userId,
          walletAddress: recipient.address.toLowerCase(),
          tokenType: request.tokenType === 'VCT' ? TokenType.VCT : TokenType.WCT,
          blockchain: relayerResponse.chain,
          contractAddress: relayerResponse.sbtaddr || 'N/A',
          status: TokenStatus.MINTED,
          metadata: {
            amount: recipient.amount,
            mintedBy: user.walletAddress,
          },
        })
      )
    );

    return {
      success: true,
      data: {
        blockchain: request.blockchain,
        recipients: request.recipients.map((r) => ({
          address: r.address,
          amount: r.amount,
          status: 'minted',
        })),
        timestamp: new Date(),
      },
      message: 'Reward tokens minted successfully',
    };
  }

  async delegateToken(request: DelegateTokenRequest): Promise<DelegateTokenResponse> {
    const user = await userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError(`User ${request.userId} not found`);
    }

    if (user.walletAddress.toLowerCase() !== request.walletAddress.toLowerCase()) {
      throw new BadRequestError('Wallet address does not match user record');
    }

    const relayerResponse = await relayerService.registerDelegateToken({
      hid: request.hid,
      himei: request.himei,
      mcc: request.mcc,
      mnc: request.mnc,
      owner: request.walletAddress,
      delegateowner: request.delegateWalletAddress,
      distributor: request.distributor,
      sig: request.sig,
      blockchain: request.blockchain,
    });

    const token = await tokenRepository.create({
      tokenId: relayerResponse.tokenid.toString(),
      userId: request.userId,
      walletAddress: request.delegateWalletAddress.toLowerCase(),
      tokenType: TokenType.DELEGATE_SOULBOUND,
      blockchain: relayerResponse.chain,
      contractAddress: relayerResponse.sbtaddr,
      imageUrl: relayerResponse.image,
      status: TokenStatus.MINTED,
      delegatedTo: request.delegateWalletAddress.toLowerCase(),
      metadata: {
        mcc: request.mcc,
        mnc: request.mnc,
        distributor: request.distributor,
        originalOwner: request.walletAddress,
      },
    });

    return {
      success: true,
      data: {
        tokenId: token.tokenId,
        walletAddress: request.walletAddress,
        delegateWalletAddress: request.delegateWalletAddress,
        blockchain: token.blockchain,
        contractAddress: token.contractAddress,
        imageUrl: token.imageUrl || '',
        timestamp: token.createdAt,
      },
      message: 'Token delegated successfully',
    };
  }
}

export default new TokenService();
