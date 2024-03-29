import { expect, describe, it, beforeEach } from "vitest"
import { RegisterUserUseCase } from "../register-user"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "../errors/user-already-exists"

let userRepository: InMemoryUsersRepository
let registerUsersUseCase: RegisterUserUseCase

beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    registerUsersUseCase = new RegisterUserUseCase(userRepository)
})

describe("Register User", () => {
    it("should be able to register", async () => {

        const { user } = await registerUsersUseCase.execute({
            nome: "Nome",
            email: "email@gmail.com",
            senha: "123456",
            cpf: "000.000.000-00",
            telefone: "00 0 0000-0000",
            cep: "00000-000",
            estado: "Estado",
            cidade: "Cidade",
            rua: "Rua",
            numero: "123",
            nascimento: "00/00/0000"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash user password upon registration", async () => {

        const { user } = await registerUsersUseCase.execute({
            nome: "Nome",
            email: "email@gmail.com",
            senha: "123456",
            cpf: "000.000.000-00",
            telefone: "00 0 0000-0000",
            cep: "00000-000",
            estado: "Estado",
            cidade: "Cidade",
            rua: "Rua",
            numero: "123",
            nascimento: "00/00/0000"
        })

        const isPasswordCorrectlyHashed = await compare("123456", user.senha_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it("should not be able to register with same email twice", async () => {

        const email = "email@gmail.com"

        await registerUsersUseCase.execute({
            nome: "Nome",
            email,
            senha: "123456",
            cpf: "000.000.000-00",
            telefone: "00 0 0000-0000",
            cep: "00000-000",
            estado: "Estado",
            cidade: "Cidade",
            rua: "Rua",
            numero: "123",
            nascimento: "00/00/0000"
        })


        await expect(() =>
            registerUsersUseCase.execute({
                nome: "Nome",
                email,
                senha: "123456",
                cpf: "000.000.000-00",
                telefone: "00 0 0000-0000",
                cep: "00000-000",
                estado: "Estado",
                cidade: "Cidade",
                rua: "Rua",
                numero: "123",
                nascimento: "00/00/0000"
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })

    it("should not be able to register with same cpf twice", async () => {

        const cpf = "000.000.000-00"

        await registerUsersUseCase.execute({
            nome: "Nome",
            email: "email@gmail.com",
            senha: "123456",
            cpf,
            telefone: "00 0 0000-0000",
            cep: "00000-000",
            estado: "Estado",
            cidade: "Cidade",
            rua: "Rua",
            numero: "123",
            nascimento: "00/00/0000"
        })


        await expect(() =>
            registerUsersUseCase.execute({
                nome: "Nome",
                email: "email@gmail.com",
                senha: "123456",
                cpf,
                telefone: "00 0 0000-0000",
                cep: "00000-000",
                estado: "Estado",
                cidade: "Cidade",
                rua: "Rua",
                numero: "123",
                nascimento: "00/00/0000"
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })
})