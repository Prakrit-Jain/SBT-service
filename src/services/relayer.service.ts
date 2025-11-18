import RelayerClient from '../config/relayer';
import { config } from '../config/env';
import {
  RegisterTokenRequest,
  DelegateTokenRequest,
  MintRewardRequest,
  RelayerResponse,
  AddressResponse,
  TokenBalanceResponse,
  BlockchainInfoResponse,
} from '../types/relayer.types';
import { RelayerApiError, ServiceUnavailableError } from '../utils/api-error';
import logger from '../utils/logger';

class RelayerService {
  private isMockMode: boolean;

  constructor() {
    this.isMockMode =
      config.relayer.baseUrl.includes('localhost:9999') ||
      config.relayer.baseUrl.includes('mock') ||
      !config.relayer.baseUrl ||
      config.relayer.baseUrl === '';
  }

  async getWalletAddress(publicKey: string): Promise<string> {
    if (this.isMockMode) {
      logger.info('Mock mode: generating wallet address');
      const hexPart = publicKey.substring(0, 40).padEnd(40, '0');
      return `0x${hexPart}`;
    }

    try {
      const response = await RelayerClient.client.get<AddressResponse>(
        `/relayer/address/${publicKey}`
      );

      if (response.data.status === 2) {
        return response.data.message;
      }

      throw new RelayerApiError(
        400,
        'Failed to get wallet address',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service error');
    }
  }

  async registerToken(request: RegisterTokenRequest): Promise<RelayerResponse> {
    if (this.isMockMode) {
      logger.info('Mock mode: registering token');
      return {
        status: 1,
        message: 'OK',
        tokenid: Math.floor(Math.random() * 1000000000000),
        image: 'https://ipfs.io/ipfs/mock-hash',
        chain: request.blockchain,
        sbtaddr: '0x76EbB010DDe57D38bB0a56477dD620977bb3C43d',
      };
    }

    try {
      console.log("Debugger");
      const response = await RelayerClient.client.post<RelayerResponse>(
        '/relayer/bip/mid',
        request
      );
      console.log("Debugger123");

      if (response.data.status === 1) {
        return response.data;
      }

      throw new RelayerApiError(
        400,
        'Token registration failed',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service error');
    }
  }

  async registerDelegateToken(request: DelegateTokenRequest): Promise<RelayerResponse> {
    if (this.isMockMode) {
      logger.info('Mock mode: registering delegate token');
      return {
        status: 1,
        message: 'OK',
        tokenid: Math.floor(Math.random() * 1000000000000),
        image: 'https://ipfs.io/ipfs/mock-delegate-hash',
        chain: request.blockchain,
        sbtaddr: '0x650F77ddbD9CC00e2EE6353360BA45fe126E8e70',
      };
    }

    try {
      const response = await RelayerClient.client.post<RelayerResponse>(
        '/relayer/bip/delegate',
        request
      );

      if (response.data.status === 1) {
        return response.data;
      }

      throw new RelayerApiError(
        400,
        'Delegate token registration failed',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service error');
    }
  }

  async checkTokenBalance(
    blockchain: string,
    address: string,
    isDelegated = false
  ): Promise<number> {
    if (this.isMockMode) {
      logger.info('Mock mode: checking token balance');
      return 1;
    }

    try {
      const endpoint = isDelegated
        ? `/relayer/midtokendel/${blockchain}/${address}`
        : `/relayer/midtoken/${blockchain}/${address}`;

      const response = await RelayerClient.client.get<TokenBalanceResponse>(endpoint);

      if (response.data.status === 1) {
        return response.data.balance;
      }

      throw new RelayerApiError(
        400,
        'Failed to check token balance',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service error');
    }
  }

  async mintRewardToken(request: MintRewardRequest): Promise<RelayerResponse> {
    if (this.isMockMode) {
      logger.info('Mock mode: minting reward tokens');
      return {
        status: 1,
        message: 'Mint successfully',
        tokenid: 0,
        image: '',
        chain: request.blockchain,
        sbtaddr: '',
      };
    }

    try {
      const response = await RelayerClient.client.post<RelayerResponse>(
        '/relayer/bip/mint',
        request
      );

      if (response.data.status === 1) {
        return response.data;
      }

      throw new RelayerApiError(
        400,
        'Reward token minting failed',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service is ');
    }
  }

  async getBlockchainInfo(): Promise<BlockchainInfoResponse> {
    try {
      const response =
        await RelayerClient.client.get<BlockchainInfoResponse>('/relayer/blockchain');

      if (response.data.status === 1) {
        return response.data;
      }

      throw new RelayerApiError(
        400,
        'Failed to get blockchain info',
        response.data.status,
        response.data.message
      );
    } catch (error: any) {
      if (error instanceof RelayerApiError) throw error;
      logger.error('Relayer API error:', error.message);
      throw new ServiceUnavailableError('Relayer service error');
    }
  }
}

const relayerService = new RelayerService();
export default relayerService;
