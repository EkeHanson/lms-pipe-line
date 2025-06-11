import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { qualityAPI } from '../../../../config';

const { Option } = Select;
const { TextArea } = Input;

const IQASampleForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [assessments, setAssessments] = useState([]);
  const [iqas, setIqas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        assessment: initialValues.assessment?.id,
        iqa: initialValues.iqa?.id,
      });
    } else {
      form.resetFields();
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [assessmentsRes, iqasRes] = await Promise.all([
          qualityAPI.getAssessments(),
          qualityAPI.getIQAs()
        ]);
        setAssessments(assessmentsRes.data);
        setIqas(iqasRes.data);
      } catch (error) {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialValues, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        decision: 'A'
      }}
    >
      <Form.Item
        name="assessment"
        label="Assessment"
        rules={[{ required: true, message: 'Please select an assessment' }]}
      >
        <Select loading={loading}>
          {assessments.map(assessment => (
            <Option key={assessment.id} value={assessment.id}>
              {assessment.unit_title} - {assessment.learner?.user?.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="iqa"
        label="IQA"
        rules={[{ required: true, message: 'Please select an IQA' }]}
      >
        <Select loading={loading}>
          {iqas.map(iqa => (
            <Option key={iqa.id} value={iqa.id}>
              {iqa.user?.full_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="decision"
        label="Decision"
        rules={[{ required: true, message: 'Please select a decision' }]}
      >
        <Select>
          <Option value="A">Approved</Option>
          <Option value="R">Revisions Required</Option>
          <Option value="I">Invalid</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="comments"
        label="Comments"
        rules={[{ required: true, message: 'Please enter comments' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="feedback_to_assessor"
        label="Feedback to Assessor"
        rules={[{ required: true, message: 'Please enter feedback' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="verification_record"
        label="Verification Record"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default IQASampleForm;