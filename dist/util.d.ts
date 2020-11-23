export declare const isOverDay: (birthtime: string | number | Date) => boolean;
export declare const isOverWeek: (birthtime: string | number | Date) => boolean;
export declare const isOverMonth: (birthtime: string | number | Date) => boolean;
export declare const rename: (type: string, rolling?: 'daily' | 'weekly' | 'monthly') => void;
export declare const convertToText: (obj: any) => string;
