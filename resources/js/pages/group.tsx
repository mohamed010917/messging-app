import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import axios from 'axios';
import DeleteModel from '@/group/DeleteModel';
import AddUser from '@/group/AddUser';
import ViewUersModel from '@/group/ViewUersModel';
import AdduserModel from '@/group/AdduserModel';
import EditModel from '@/group/EditModel';
import Table from '@/group/Table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Group',
        href: '/group',
    },
];

function GroupPage() {
    const page = usePage();
    const [groups, setGroups] = useState(page.props.groups || []);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false) ;
    const [editData, setEditData] = useState({ id: null, name: '', description: '' })
    const [addModalOpen, setAddModalOpen] = useState(false)


    const [addUsersModalOpen, setAddUsersModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>(page.props.users);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [targetGroupId, setTargetGroupId] = useState<number | null>(null);


    const [viewUsersModalOpen, setViewUsersModalOpen] = useState(false);
    const [groupUsers, setGroupUsers] = useState<any[]>([]);
    const [currentGroupName, setCurrentGroupName] = useState('');



    const openViewUsersModal = (group: any) => {
      axios.get(`/group/${group.id}`)
        .then(res => {
          console.log(res.data.group.users)
          setGroupUsers(res.data.group.users);
          setCurrentGroupName(res.data.group.name);
          setTargetGroupId(group.id);
          setViewUsersModalOpen(true);
        })
        .catch(err => {
          console.error(err);
        });
    };

    const handleRemoveUserFromGroup = (userId: number) => {
  if (!targetGroupId) return;

  axios.post(`/group/${targetGroupId}/users/${userId}`)
    .then(() => {
      setGroupUsers(prev => prev.filter(u => u.id !== userId));
    })
    .catch(err => {
      console.error(err);
    });
};




    const openAddUsersModal = (groupId: number) => {
      setTargetGroupId(groupId);
      setSelectedUsers([]);
      setAddUsersModalOpen(true);
    }


    const handleAddUsersToGroup = () => {
      if (!targetGroupId) return;

      axios.post(`/group/${targetGroupId}/users`, {
        user_ids: selectedUsers,
      })
      .then((res) => {
        setAddUsersModalOpen(false);
      
      })
      .catch((err) => {
        console.error(err);
     
      });
    };


    function deleteGroup() {
        if (!selectedGroupId) return
            axios.post(`/group/${selectedGroupId}`,{_method: 'DELETE'})
                .then((response) => {
                    setGroups(groups.filter((group: any) => group.id !== selectedGroupId));
                    setSelectedGroupId(null) ;
                })
                .catch((error) => {
                    setSelectedGroupId(null) ;
                    console.error(error);
                    
                });
        
    }



    const openEditModal = (group: any) => {
    setEditData({
      id: group.id,
      name: group.name,
      description: group.description,
    })
    setEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios
      .post(`/group/${editData.id}`, {
        _method: 'PUT',
        name: editData.name,
        description: editData.description,
      })
      .then((response) => {
        console.log(response)
        const updatedGroup = response.data.group
        setGroups((prev) =>
          prev.map((g: any) => (g.id === updatedGroup.id ? updatedGroup : g))
        )
        setEditModalOpen(false)
      })
      .catch((err) => {
        console.error(err)
       
      })
  }



  const handleAddSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  axios
    .post(`/group`, {
      name: editData.name,
      description: editData.description,
      
    })
    .then((response) => {
      const newGroup = response.data.group
      setGroups((prev) => [newGroup, ...prev])
      setAddModalOpen(false)
    })
    .catch((err) => {
      console.error(err)
     
    })
}



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group" />
            <div >

            <button
              onClick={() => {
                setEditData({ id: null, name: '', description: '' })
                setAddModalOpen(true)
            }}
            className="btn btn-soft m-4  btn-primary w-[100px]">Add</button>
            </div>
            <AddUser 
                   addUsersModalOpen={addUsersModalOpen} 
                    allUsers={allUsers}  
                    selectedUsers={selectedUsers} 
                    setSelectedUsers={setSelectedUsers}
                    setAddUsersModalOpen={setAddUsersModalOpen}
                    handleAddUsersToGroup={handleAddUsersToGroup}
            />
            <DeleteModel selectedGroupId={selectedGroupId}  setSelectedGroupId={setSelectedGroupId} deleteGroup={deleteGroup} />
            <ViewUersModel 
                viewUsersModalOpen={    viewUsersModalOpen}
              currentGroupName={    currentGroupName}
              groupUsers={    groupUsers}
              handleRemoveUserFromGroup={    handleRemoveUserFromGroup}
              setViewUsersModalOpen={    setViewUsersModalOpen}
            />


            <AdduserModel 
            addModalOpen={addModalOpen}
            handleAddSubmit={handleAddSubmit}
            editData={editData}
            setEditData={setEditData}
            setAddModalOpen={setAddModalOpen}
            />



            <EditModel 
            editModalOpen ={editModalOpen}
            handleEditSubmit ={handleEditSubmit}
            editData ={editData}
            setEditData ={setEditData}
            setEditModalOpen ={setEditModalOpen}
            />


            <Table
            groups={groups}
            openEditModal={openEditModal}
            setSelectedGroupId={setSelectedGroupId}
            openAddUsersModal={openAddUsersModal}
            openViewUsersModal={openViewUsersModal}
            />
        </AppLayout>
    );
}

export default GroupPage;
