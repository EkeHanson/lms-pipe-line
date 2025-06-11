import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Switch, Spin, message } from 'antd';
import moment from 'moment';
import { qualityAPI } from '../../../../config';

const { Option } = Select;
const { TextArea } = Input;

const EQAVisitForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [eqas, setEqas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await qualityAPI.getEQAs();
        setEqas(response.data || []); // Ensure it's always an array
      } catch (err) {
        setError(err.message);
        message.error('Failed to fetch EQAs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        visit_date: initialValues.visit_date ? moment(initialValues.visit_date) : null,
        eqa: initialValues.eqa?.id,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    onSubmit({
      ...values,
      visit_date: values.visit_date.format('YYYY-MM-DD'),
    });
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        visit_type: 'P',
        completed: false
      }}
    >
      <Form.Item
        name="visit_date"
        label="Visit Date"
        rules={[{ required: true, message: 'Please select a visit date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="visit_type"
        label="Visit Type"
        rules={[{ required: true, message: 'Please select a visit type' }]}
      >
        <Select>
          <Option value="P">Physical Visit</Option>
          <Option value="R">Remote Visit</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="eqa"
        label="EQA"
        rules={[{ required: true, message: 'Please select an EQA' }]}
      >
        <Select loading={loading}>
          {Array.isArray(eqas) && eqas.map(eqa => (
            <Option key={eqa.id} value={eqa.id}>
              {eqa.user?.full_name} ({eqa.awarding_body})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="agenda"
        label="Agenda"
        rules={[{ required: true, message: 'Please enter an agenda' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="completed"
        label="Completed"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EQAVisitForm;