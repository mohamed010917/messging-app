
import { Link } from '@inertiajs/react'
import React from 'react'

function Table({
                groups,
            openEditModal,
            setSelectedGroupId,
            openAddUsersModal,
            openViewUsersModal,
            }) 
{
  return (
    
    <div className="overflow-x-auto p-4">
        <div className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-md transition-colors">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((e: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-2">{e.id}</td>
                            <td className="px-4 py-2">{e.name}</td>
                            <td className="px-4 py-2">{e.description}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button   onClick={() => openEditModal(e)} className="btn btn-soft btn-success">update</button>
                                <Link href={`/group_chat/${e.id}`} className="btn btn-soft btn-secondary">show</Link>
                                <button onClick={() => setSelectedGroupId(e.id)} className="btn btn-soft btn-error">Delete</button>
                                <button
                                onClick={() => openAddUsersModal(e.id)}
                                className="btn btn-soft btn-info"
                                >
                                Add Users
                                </button>
                                <button onClick={() => openViewUsersModal(e)} className="btn btn-soft btn-warning">
                                    Show Users
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Table