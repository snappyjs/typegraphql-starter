import { AuthChecker } from "type-graphql";

export const authChecker : AuthChecker<any, any> = ({ context }, roles) => {
    return context.user.roles.some((name: string) => roles.includes(name));
}