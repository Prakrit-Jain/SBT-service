import UserModel from '../models/user.model';
import { IUser } from '../types/database.types';
import { NotFoundError, ConflictError } from '../utils/api-error';
import logger from '../utils/logger';

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const existingUser = await UserModel.findOne({
        $or: [{ userId: userData.userId }, { walletAddress: userData.walletAddress }],
      });

      if (existingUser) {
        throw new ConflictError('User with this ID or wallet address already exists');
      }

      const user = new UserModel(userData);
      await user.save();

      logger.info(`User created: ${user.userId}`);
      return user.toObject();
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async findById(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ userId });
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error(`Error finding user by ID ${userId}:`, error);
      throw error;
    }
  }

  async findByWalletAddress(walletAddress: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({
        walletAddress: walletAddress.toLowerCase(),
      });
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error(`Error finding user by wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  async update(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      logger.info(`User updated: ${userId}`);
      return user.toObject();
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const result = await UserModel.deleteOne({ userId });

      if (result.deletedCount === 0) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      logger.info(`User deleted: ${userId}`);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        UserModel.countDocuments(),
      ]);

      return {
        users: users.map((u) => u.toObject()),
        total,
      };
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw error;
    }
  }
}

export default new UserRepository();
