import React from 'react'

function DeleteModel({selectedGroupId , setSelectedGroupId , deleteGroup }) {
    
  return selectedGroupId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Are you sure you want to delete this group?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                onClick={() => setSelectedGroupId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteGroup}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )
}

export default DeleteModel