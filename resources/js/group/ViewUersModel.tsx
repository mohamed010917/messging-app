import React from 'react'

function ViewUersModel({
    viewUsersModalOpen ,
    currentGroupName,
    groupUsers,
    handleRemoveUserFromGroup,
    setViewUsersModalOpen
}) {
  return viewUsersModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Users in {currentGroupName}</h2>
      <div className="max-h-[300px] overflow-y-auto mb-4 space-y-2">
        {groupUsers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No users in this group.</p>
        ) : (
          groupUsers.map((user: any) => (
            <div key={user.id} className="flex justify-between items-center border-b pb-2 text-gray-800 dark:text-white">
              <div>
                {user.name} ({user.email})
              </div>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                onClick={() => handleRemoveUserFromGroup(user.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setViewUsersModalOpen(false)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)
}

export default ViewUersModel