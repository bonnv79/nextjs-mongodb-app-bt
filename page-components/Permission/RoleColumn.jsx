import { fetcher } from "@/lib/fetch";
import { usePermissionPages } from "@/lib/permission";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Select, Tag } from "antd";
import { PERMISSION } from "constants/permission";
import { useState } from "react";
import toast from "react-hot-toast";
import { arrayEquals } from "utils/array";
const { Option } = Select;

export const RoleColumn = ({ data, record, isEdit }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(data);
  const [open, setOpen] = useState(false);
  const { mutate } = usePermissionPages();

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
    if (value?.length <= 0) {
      toast.error('The roles field cannot be empty');
      handleClose();
      setValue(data);
      return;
    }

    if (arrayEquals(value, data)) {
      handleClose();
      return;
    }

    try {
      setLoading(true);
      await fetcher('/api/permission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: record.role_id, roles: value }),
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
            mode="multiple"
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
            {(Object.keys(PERMISSION)).map(tag => {
              return (
                <Option key={tag}>{tag}</Option>
              )
            })}
          </Select>
        ) : value.map(tag => {
          return (
            <Tag
              style={{ marginBottom: 8 }}
              color="blue"
              className="edit-tag"
              key={tag}
            >
              {tag}
            </Tag>
          )
        })
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
