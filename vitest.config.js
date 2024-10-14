import { defineConfig } from 'vitest/config';

export default defineConfig({
    test:{
        environment:'jsdom', //This tells vtest to use the jsdom
    },
})