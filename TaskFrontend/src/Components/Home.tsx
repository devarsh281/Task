"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Add from "./Add"
import Display from "./Display"


const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Task Manager</h1>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 p-6 border-r border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
                <Add />
              </div>
              <div className="md:w-2/3 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Task List</h2>
                <Display />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

