import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(request : FastifyRequest<{
    Body: CreateUserInput;
}>, reply : FastifyReply) {
    const body = request.body

    try {
        const user = await createUser(body);
        if(!user) {
            return reply.code(201).send("Sign up failed due invalid email or password")
        }
        const { password, salt, id, email, name} = user;

        return reply.code(201).send({
            id: id,
            email: email,
            name: name,
        });
    } catch(e) {
        console.log(e)
        return reply.code(500).send(e);
    }
}

export async function loginHandler(request : FastifyRequest<{
    Body: LoginInput
}>, reply: FastifyReply) {
    const body = request.body

    const user = await findUserByEmail(body.email);

    if(!user){
        return reply.code(401).send({
            message: "Invalid email or password"
        })
    }

    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password
    })

    if(correctPassword){
        const {password, salt,  ...rest} = user

        return { accessToken : server.jwt.sign(rest)}
    }

    return reply.code(401).send({
        message: "Invalid email or password."
    })
}

export async function getUsersHandler(request : FastifyRequest, reply : FastifyReply){
    const users = await findUsers();

    if(!users){
        return reply.code(500).send({ message : "Internal Server Error"})
    }

    return reply.code(200).send(users)
}