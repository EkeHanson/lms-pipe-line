import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Spin } from 'antd';
import { qualityAPI } from '../../../../config';
import IQASampleForm from './IQASampleForm';

const IQASampleList = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const columns = [
    {
      title: 'Assessment',
      dataIndex: ['assessment', 'unit_title'],
      key: 'assessment',
    },
    {
      title: 'Decision',
      dataIndex: 'decision',
      key: 'decision',
      render: (decision) => {
        const decisions = {
          'A': 'Approved',
          'R': 'Revisions Required',
          'I': 'Invalid'
        };
        return decisions[decision] || decision;
      }
    },
    {
      title: 'IQA',
      dataIndex: ['iqa', 'user', 'full_name'],
      key: 'iqa',
    },
    {
      title: 'Date',
      dataIndex: 'sample_date',
      key: 'sample_date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    setLoading(true);
    try {
      const response = await qualityAPI.getIQASamples();
      setSamples(response.data);
    } catch (error) {
      message.error('Failed to fetch IQA samples');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSample(null);
    setModalVisible(true);
  };

  const handleEdit = (sample) => {
    setSelectedSample(sample);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await qualityAPI.deleteIQASample(id);
      message.success('IQA sample deleted successfully');
      fetchSamples();
    } catch (error) {
      message.error('Failed to delete IQA sample');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedSample) {
        await qualityAPI.updateIQASample(selectedSample.id, values);
        message.success('IQA sample updated successfully');
      } else {
        await qualityAPI.createIQASample(values);
        message.success('IQA sample created successfully');
      }
      setModalVisible(false);
      fetchSamples();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Add IQA Sample
      </Button>
      
      <Table 
        columns={columns} 
        dataSource={samples} 
        rowKey="id" 
        loading={loading}
      />
      
      <Modal
        title={selectedSample ? 'Edit IQA Sample' : 'Create IQA Sample'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <IQASampleForm 
          initialValues={selectedSample} 
          onSubmit={handleSubmit} 
        />
      </Modal>
    </div>
  );
};

export default IQASampleList;