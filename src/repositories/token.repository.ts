import TokenModel from '../models/token.model';
import { IToken, TokenType, TokenStatus } from '../types/database.types';
import { NotFoundError } from '../utils/api-error';
import logger from '../utils/logger';

class TokenRepository {
  async create(tokenData: Partial<IToken>): Promise<IToken> {
    try {
      const token = new TokenModel(tokenData);
      await token.save();

      logger.info(`Token created: ${token.tokenId}`);
      return token.toObject();
    } catch (error) {
      logger.error('Error creating token:', error);
      throw error;
    }
  }

  async findById(tokenId: string): Promise<IToken | null> {
    try {
      const token = await TokenModel.findOne({ tokenId });
      return token ? token.toObject() : null;
    } catch (error) {
      logger.error(`Error finding token ${tokenId}:`, error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<IToken[]> {
    try {
      const tokens = await TokenModel.find({ userId }).sort({ createdAt: -1 });
      return tokens.map((t) => t.toObject());
    } catch (error) {
      logger.error(`Error finding tokens for user ${userId}:`, error);
      throw error;
    }
  }

  async findByWalletAddress(walletAddress: string, blockchain?: string): Promise<IToken[]> {
    try {
      const query: any = { walletAddress: walletAddress.toLowerCase() };
      if (blockchain) query.blockchain = blockchain;

      const tokens = await TokenModel.find(query).sort({ createdAt: -1 });
      return tokens.map((t) => t.toObject());
    } catch (error) {
      logger.error(`Error finding tokens for wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  async updateStatus(
    tokenId: string,
    status: TokenStatus,
    transactionHash?: string
  ): Promise<IToken> {
    try {
      const updateData: any = { status };
      if (transactionHash) updateData.transactionHash = transactionHash;

      const token = await TokenModel.findOneAndUpdate(
        { tokenId },
        { $set: updateData },
        { new: true }
      );

      if (!token) {
        throw new NotFoundError(`Token ${tokenId} not found`);
      }

      logger.info(`Token status updated: ${tokenId} -> ${status}`);
      return token.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error(`Error updating token status ${tokenId}:`, error);
      throw error;
    }
  }

  async findByTypeAndStatus(tokenType: TokenType, status: TokenStatus): Promise<IToken[]> {
    try {
      const tokens = await TokenModel.find({ tokenType, status }).sort({
        createdAt: -1,
      });
      return tokens.map((t) => t.toObject());
    } catch (error) {
      logger.error('Error finding tokens by type and status:', error);
      throw error;
    }
  }
}

export default new TokenRepository();
