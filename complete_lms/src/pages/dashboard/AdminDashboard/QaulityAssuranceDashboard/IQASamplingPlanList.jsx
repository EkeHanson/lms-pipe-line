import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Spin, Badge } from 'antd';
import { qualityAPI } from '../../../../config';
import IQASamplingPlanForm from './IQASamplingPlanForm';

const IQASamplingPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [iqas, setIqas] = useState([]);

  const columns = [
    {
      title: 'Qualification',
      dataIndex: ['qualification', 'name'],
      key: 'qualification',
    },
    {
      title: 'IQA',
      dataIndex: ['iqa', 'user', 'full_name'],
      key: 'iqa',
    },
    {
      title: 'Date Range',
      key: 'date_range',
      render: (_, record) => (
        <span>
          {record.start_date} to {record.end_date}
        </span>
      ),
    },
    {
      title: 'Sample Size',
      dataIndex: 'sample_size_percent',
      key: 'sample_size',
      render: (percent) => `${percent}%`,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const today = new Date();
        const startDate = new Date(record.start_date);
        const endDate = new Date(record.end_date);
        
        if (today < startDate) {
          return <Badge status="default" text="Pending" />;
        } else if (today > endDate) {
          return <Badge status="success" text="Completed" />;
        } else {
          return <Badge status="processing" text="Active" />;
        }
      },
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansRes, qualsRes, iqasRes] = await Promise.all([
        qualityAPI.getIQASamplingPlans(),
        qualityAPI.getQualifications(),
        qualityAPI.getIQAs()
      ]);
      setPlans(plansRes.data);
      setQualifications(qualsRes.data);
      setIqas(iqasRes.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    setModalVisible(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await qualityAPI.deleteIQASamplingPlan(id);
      message.success('Sampling plan deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete sampling plan');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedPlan) {
        await qualityAPI.updateIQASamplingPlan(selectedPlan.id, values);
        message.success('Sampling plan updated successfully');
      } else {
        await qualityAPI.createIQASamplingPlan(values);
        message.success('Sampling plan created successfully');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        Create Sampling Plan
      </Button>
      
      <Table 
        columns={columns} 
        dataSource={plans} 
        rowKey="id" 
        loading={loading}
      />
      
      <Modal
        title={selectedPlan ? 'Edit Sampling Plan' : 'Create Sampling Plan'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <IQASamplingPlanForm 
          initialValues={selectedPlan} 
          onSubmit={handleSubmit} 
          qualifications={qualifications}
          iqas={iqas}
        />
      </Modal>
    </div>
  );
};

export default IQASamplingPlanList;