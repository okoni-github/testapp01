import { type Timestamp } from 'firebase/firestore'

interface Transaction {
    id: string
    amount: number
    type: string
    date: Date
    updatedAt: Timestamp
}

export type { Transaction }