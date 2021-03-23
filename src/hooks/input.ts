import { useState } from 'react';

export const useInput = (initial: string) => {
    const [value, setValue] = useState(initial);

    return {
        value,
        setValue,
        reset: () => setValue(''),
        bind: {
            value,
            onChange: event => {
                setValue(event.target.value);
            }
        }
    };
};