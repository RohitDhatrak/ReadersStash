export function getUserFromLocalStorage(): string {
    const user = localStorage.getItem("user");
    if (user) return user;
    else return "{}";
}
