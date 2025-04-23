import { LoginDto, RegisterDto } from '@/dto/auth.dto';
import { hash, compare } from 'bcrypt';
import { BadRequestError } from '@/lib/ApiError';
import { db, User } from '@leetcraft/db';
import jwt from 'jsonwebtoken';
import env from '@/config/env';

class AuthService {
  async register(dto: RegisterDto) {
    // check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    // hash password
    const hashedPassword = await hash(dto.password, 12);

    // save user to database
    const { password, ...user } = await db.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // return user
    return user;
  }

  async login(dto: LoginDto) {
    // check if user exists
    const user = await this.getUserByEmailOrId(dto.email);

    // check if the password is correct
    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // remove password from user object
    const { password, ...userWithoutPassword } = user;

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      },
    );

    // return token with user info
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async me(userId: string) {
    // Get the user by id
    const { password, ...user } = await this.getUserByEmailOrId(userId);
    return user;
  }

  private async getUserByEmailOrId(search: string): Promise<User> {
    // Check if the user exists by emails and if not check by id
    // Throw an error if the user is not found
    // Otherwise return the user
    const user =
      (await db.user.findUnique({
        where: {
          email: search,
        },
      })) ??
      (await db.user.findUnique({
        where: {
          id: search,
        },
      }));

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user;
  }
}

export default AuthService;
