import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Spin } from 'antd';
import { qualityAPI } from '../../../../config';
import EQAVisitForm from './EQAVisitForm';

const EQAVisitList = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const columns = [
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      key: 'visit_date',
    },
    {
      title: 'Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      render: (type) => (
        <Tag color={type === 'P' ? 'blue' : 'green'}>
          {type === 'P' ? 'Physical' : 'Remote'}
        </Tag>
      ),
    },
    {
      title: 'EQA',
      dataIndex: ['eqa', 'user', 'full_name'],
      key: 'eqa',
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => (
        <Tag color={completed ? 'green' : 'orange'}>
          {completed ? 'Completed' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
          <Button type="link" onClick={() => handleViewSamples(record.id)}>Samples</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await qualityAPI.getEQAVisits();
      setVisits(response.data);
    } catch (error) {
      message.error('Failed to fetch EQA visits');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedVisit(null);
    setModalVisible(true);
  };

  const handleEdit = (visit) => {
    setSelectedVisit(visit);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await qualityAPI.deleteEQAVisit(id);
      message.success('EQA visit deleted successfully');
      fetchVisits();
    } catch (error) {
      message.error('Failed to delete EQA visit');
    }
  };

  const handleViewSamples = (visitId) => {
    // Implement navigation to samples for this visit
    message.info(`Viewing samples for visit ${visitId}`);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedVisit) {
        await qualityAPI.updateEQAVisit(selectedVisit.id, values);
        message.success('EQA visit updated successfully');
      } else {
        await qualityAPI.createEQAVisit(values);
        message.success('EQA visit created successfully');
      }
      setModalVisible(false);
      fetchVisits();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Schedule EQA Visit
      </Button>
      
      <Table 
        columns={columns} 
        dataSource={visits} 
        rowKey="id" 
        loading={loading}
      />
      
      <Modal
        title={selectedVisit ? 'Edit EQA Visit' : 'Schedule EQA Visit'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <EQAVisitForm 
          initialValues={selectedVisit} 
          onSubmit={handleSubmit} 
        />
      </Modal>
    </div>
  );
};

export default EQAVisitList;