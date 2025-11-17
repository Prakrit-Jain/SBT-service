import userRepository from '../repositories/user.repositry';
import relayerService from './relayer.service';
import { IUser } from '../types/database.types';
import { RegisterUserRequest, RegisterUserResponse } from '../types/api.types';
import { BadRequestError } from '../utils/api-error';

class UserService {
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    if (!request.publicKey) {
      throw new BadRequestError('Public key is required to generate wallet address');
    }

    const walletAddress = await relayerService.getWalletAddress(request.publicKey);

    const userData: Partial<IUser> = {
      userId: request.userId,
      walletAddress: walletAddress.toLowerCase(),
      publicKey: request.publicKey,
      email: request.email,
      name: request.name,
    };

    const user = await userRepository.create(userData);

    return {
      success: true,
      data: {
        userId: user.userId,
        walletAddress: user.walletAddress,
        status: 'registered',
      },
      message: 'User registered successfully',
    };
  }
}

export default new UserService();
