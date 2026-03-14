export class Task {
    private constructor(
        public readonly id: string,
        public readonly title: string,
    ) {}

    static create(title: string): Task {
        if (!title || !title.trim()) {
            throw new Error('Task title cannot be empty');
        }
        return new Task(crypto.randomUUID(), title.trim());
    }

    // Para reconstituir do storage sem gerar novo ID
    static reconstitute(id: string, title: string): Task {
        return new Task(id, title);
    }
}