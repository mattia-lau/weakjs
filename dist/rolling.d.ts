export declare class Rolling {
    private rolling;
    private static instance;
    private cronjob;
    static getInstance(): Rolling;
    roll(rolling: "daily" | "weekly" | "monthly", callback: Function, timezone?: string): void;
    private getCronExpression;
}
export default Rolling;
