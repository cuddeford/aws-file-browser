import { type ReactNode, type ComponentType } from 'react'

type ProvideProps = { children: ReactNode }

export const composeProviders = (...providers: ComponentType<ProvideProps>[]) => {
    return ({ children }: ProvideProps) => {
        return providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>
        }, children)
    }
}
