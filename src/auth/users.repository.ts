import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";


@Injectable()
export class UsersRepository {
    // Define methods for user data access
    private repo: Repository<User>; // Replace 'any' with actual User entity type

    constructor(private dataSource: DataSource ) {
        // Initialize the repository
        this.repo = dataSource.getRepository(User);
    }

    create(userData: Partial<User>) {
        return this.repo.create(userData);
    }

    save(user: User) {
        return this.repo.save(user);
    }

    findAll() {
        // Implement method to find all users
    }

    findOneById(id: number) {
        // Implement method to find a user by ID
    }

    findOne(options: object) {
        return this.repo.findOne(options);
    }
}