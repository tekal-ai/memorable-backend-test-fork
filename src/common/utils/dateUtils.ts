export function getInitDateOrDefault(date?: Date) {
    return date ?? new Date("1970-01-01");
}

export function getInitDateOrDefaultString(date?: Date) {
    return getInitDateOrDefault(date).toISOString().split("T")[0];
}
export function getEndDateOrDefault(date?: Date) {
    return date ?? new Date();
}

export function getEndDateOrDefaultString(date?: Date) {
    return getEndDateOrDefault(date).toISOString().split("T")[0];
}
