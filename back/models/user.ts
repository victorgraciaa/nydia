import { ObjectId, OptionalId } from "mongodb";

export type User = {
    id: string,
    username: string,
    password: string,
    age: number,
    height: number,
    weight: number,
    gender: "male" | "female",
    created_at: Date
}

export type UserModel = OptionalId<{
    username: string,
    password: string,
    age: number,
    height: number,
    weight: number,
    gender: "male" | "female",
    created_at: Date
}>