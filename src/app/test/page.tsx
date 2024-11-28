'use client'
import {transactions} from "@/data"
import { useEffect, useState } from "react"

type Transactions = (typeof transactions)
type Transaction = Transactions[number]

const fetchData = (): Promise<Transactions> => {
    return new Promise((res) => {
        setTimeout(() => {
            res(transactions)
        }, 2000)
    })
}

export default function Test() {
    const [transactionsState, setTransactionState] = useState<Transactions>([])
    const [transactionAmountInputValue, setTransactionAmountInputValue] = useState('');
    const [targetAmountInput, setTargetAmountInput] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = () => {
        setIsLoading(true);
        
        fetchData().then(data => {
            setTransactionState([...data]);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        fetchTransactions()
    }, [])


    const addTransaction = (transaction: Transaction) => {
        transactions.push(transaction);

        fetchTransactions()
        setTransactionAmountInputValue('')
    }

    const checkTransaction = () => {
        const sum = transactions.reduce((prev, cur) => {
            return prev + cur.amount;
        }, 0)

        if (parseInt(targetAmountInput) !== sum) {
            setTransactionState([]);
            return;
        }

        fetchTransactions()
    }

    const renderTransactions = () => {
        if (isLoading) return <p>Loading transaction...</p>
        if (transactionsState.length === 0) return  <p>No matching transactions found.</p>

        return  transactionsState.map(transaction => {
            return  <div 
                        key={transaction.id}
                        className="flex items-start flex-col">
                            <span>Transaction {transaction.id}</span>
                            <p>Amount: USD {transaction.amount.toLocaleString('en-US', {currency: 'USD'})}</p>
                    </div>
        })
    }
    
    return (
        <div className="p-2">
            <h1 className="text-2xl">Transactions List</h1>

            <div
                className="flex gap-2"
                >
                    <input 
                        className="p-2 border-solid border border-gray-300 rounded"
                        value={targetAmountInput}
                        onChange={(e) => {setTargetAmountInput(e.target.value)}}
                        placeholder="Target amount"
                        type="number"
                    />

                    <button 
                        disabled={!targetAmountInput.length}
                        onClick={checkTransaction}
                        className="bg-gray-500 p-2 rounded text-white hover:bg-gray-400 disabled:bg-gray-200 transition-all">
                        Check Transactions
                    </button>
            </div>

            <div className="flex flex-col gap-2 my-2">
               {renderTransactions()}
            </div>
           

            <div className="flex gap-2">
                <input
                    className="p-2 border-solid border border-gray-300 rounded"
                    placeholder="Transaction amount"
                    type="number"
                    value={transactionAmountInputValue}
                    onChange={(e) => {
                        setTransactionAmountInputValue(e.target.value)
                    }}
                />

                <button
                    className="bg-gray-500 p-2 rounded text-white hover:bg-gray-400 disabled:bg-gray-200 transition-all"
                    disabled={!transactionAmountInputValue.length}
                    onClick={() => {
                        addTransaction({
                            amount: parseInt(transactionAmountInputValue),
                            id: `${Math.random().toString(32).replace(/0./, '')}`
                        })
                    }}>
                    Add transaction
                </button>
            </div>
        </div>
    )
}