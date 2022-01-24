import { GetServerSideProps } from 'next';

export type WithAuthProps = Record<string, unknown>;
export type WithAuthReturn<P> = GetServerSideProps<P>;
