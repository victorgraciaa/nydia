import { ObjectId, OptionalId } from "mongodb";

export type User = {
    id: string,
    username: string,
    password: string,
    age: number,
    height: number,
    weight: number,
    gender: "hombre" | "mujer",
    activity_level: "sedentario" | "ligero" | "moderado" | "activo" | "muy_activo",
    created_at: Date
}

export type UserModel = OptionalId<{
    username: string,
    password: string,
    age: number,
    height: number,
    weight: number,
    gender: "hombre" | "mujer",
    activity_level: "sedentario" | "ligero" | "moderado" | "activo" | "muy_activo",
    created_at: Date
}>