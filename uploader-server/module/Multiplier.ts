interface Multiplier {
    /**
     * @returns {number} a * b
     */
    multiply(a: number, b: number): number;
}

class 똑똑 implements Multiplier {
    multiply(a: number, b: number): number {
        return a * b;
    }
}

class 노가다 implements Multiplier {
    multiply(a: number, b: number): number {
        let result = 0;
        for (let i = 0; i < b; i++) {
            result += a;
        }
        return result;
    }
}