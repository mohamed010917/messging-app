import React from 'react'

function EditModel({
    editModalOpen ,
    handleEditSubmit ,
    editData ,
    setEditData ,
    setEditModalOpen ,
}) {
  return  editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit Group</h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )

}

export default EditModel