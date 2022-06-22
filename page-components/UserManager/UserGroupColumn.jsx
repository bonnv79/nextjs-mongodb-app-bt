import { fetcher } from "@/lib/fetch";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Select, Tag } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
const { Option } = Select;

export const UserGroupColumn = ({ data, record, isEdit, mutate, permissionData }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(data);
  const [open, setOpen] = useState(false);

  const handleChange = (val) => {
    setValue(val);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = async () => {

    if (value === data) {
      handleClose();
      return;
    }

    try {
      setLoading(true);
      await fetcher('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record?._id, role_id: value }),
      });

      toast.success('You have saved successfully');
      mutate();
    } catch (e) {
      toast.error(e.message);
      setValue(data);
    } finally {
      setLoading(false);
      handleClose();
    }
  }

  return (
    <span>
      {
        open ? (
          <Select
            style={{
              minWidth: 150,
              marginRight: 8,
              maxWidth: '100%'
            }}
            placeholder="Please select"
            defaultValue={value}
            onChange={handleChange}
            size="small"
            onBlur={handleSave}
            autoFocus
          >
            {permissionData?.map(item => {
              return (
                <Option key={item.role_id}>{item.role_id}</Option>
              )
            })}
          </Select>
        ) : (
          <Tag
            style={{ marginBottom: 8 }}
            color="blue"
            className="edit-tag"
          >
            {value || 'USER'}
          </Tag>
        )
      }

      {isEdit && (
        <Button
          type="link"
          loading={loading}
          onClick={open ? handleSave : handleOpen}
          icon={open ? <SaveOutlined /> : <EditOutlined />}
        />
      )}
    </span>
  );
};
