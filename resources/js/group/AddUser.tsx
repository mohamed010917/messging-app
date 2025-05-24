import React from 'react'

function AddUser({addUsersModalOpen , 
                    allUsers  ,
                    selectedUsers 
                    ,setSelectedUsers
                    , setAddUsersModalOpen
                    ,handleAddUsersToGroup
                    }) {
  return addUsersModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Users to Group</h2>
      <div className="max-h-[300px] overflow-y-auto mb-4 space-y-2">
        {allUsers.map((user: any) => (
          <label key={user.id} className="flex items-center gap-2 text-gray-800 dark:text-white">
            <input
              type="checkbox"
              value={user.id}
              checked={selectedUsers.includes(user.id)}
              onChange={(e) => {
                const userId = user.id;
                if (e.target.checked) {
                  setSelectedUsers((prev) => [...prev, userId]);
                } else {
                  setSelectedUsers((prev) => prev.filter((id) => id !== userId));
                }
              }}
            />
            {user.name} ({user.email})
          </label>
        ))}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setAddUsersModalOpen(false)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddUsersToGroup}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)
}

export default AddUser