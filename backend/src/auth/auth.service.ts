import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { users } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Vérifie les identifiants d'un utilisateur et génère un token JWT
   *
   * @param email Email fourni par l'utilisateur
   * @param password Mot de passe fourni par l'utilisateur
   * @returns Un token JWT
   * @throws {UnauthorizedException} Si l'email est inconnu ou si le mot de passe est incorrect
   */
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  /**
   * Enregistre un utilisateur puis le connecte automatiquement
   *
   * @param email Email fourni par l'utilisateur
   * @param name Nom fourni par l'utilisateur
   * @param password Mot de passe fourni par l'utilisateur
   * @returns Un token JWT
   * @throws {ConflictException} Si un utilisateur existe déjà avec cet email
   */
  async register(email: string, name: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) throw new ConflictException('Email already exist');

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      email: email,
      name: name,
      password: hashPassword,
    });

    return this.generateToken(newUser);
  }

  /**
   * Signe un JWT
   *
   * @param user Utilisateur pour lequel générer le token
   * @returns Un token JWT
   */
  private generateToken(user: users) {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload);
  }
}
