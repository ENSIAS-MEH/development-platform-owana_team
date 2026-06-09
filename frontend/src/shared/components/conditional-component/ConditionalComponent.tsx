import React from 'react';

type PropsType = {
    isValid: boolean;
    defaultComponent?: React.ReactNode | JSX.Element;
    children: React.ReactNode | JSX.Element;
}
export default function ConditionalComponent({ isValid, defaultComponent, children }: PropsType): JSX.Element {
    return (
        <>
            {isValid ? children : defaultComponent || null}
        </>
    )
}