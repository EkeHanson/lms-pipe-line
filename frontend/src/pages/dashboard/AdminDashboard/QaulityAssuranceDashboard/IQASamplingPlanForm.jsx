import React from 'react';
import { Form, Input, Select, Button, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const IQASamplingPlanForm = ({ initialValues, onSubmit, qualifications, iqas }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        start_date: initialValues.start_date ? moment(initialValues.start_date) : null,
        end_date: initialValues.end_date ? moment(initialValues.end_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    onSubmit({
      ...values,
      start_date: values.start_date.format('YYYY-MM-DD'),
      end_date: values.end_date.format('YYYY-MM-DD'),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="qualification"
        label="Qualification"
        rules={[{ required: true, message: 'Please select a qualification' }]}
      >
        <Select>
          {qualifications.map(qual => (
            <Option key={qual.id} value={qual.id}>
              {qual.name} ({qual.code})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="iqa"
        label="IQA"
        rules={[{ required: true, message: 'Please select an IQA' }]}
      >
        <Select>
          {iqas.map(iqa => (
            <Option key={iqa.id} value={iqa.id}>
              {iqa.user?.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="start_date"
        label="Start Date"
        rules={[{ required: true, message: 'Please select a start date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="end_date"
        label="End Date"
        rules={[{ required: true, message: 'Please select an end date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="sample_size_percent"
        label="Sample Size (%)"
        rules={[
          { required: true, message: 'Please enter sample size' },
          { type: 'number', min: 1, max: 100, message: 'Must be between 1 and 100' }
        ]}
      >
        <InputNumber min={1} max={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="criteria"
        label="Sampling Criteria"
        rules={[{ required: true, message: 'Please enter sampling criteria' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default IQASamplingPlanForm;