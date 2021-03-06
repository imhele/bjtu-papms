import { SimpleFormItemType } from '../link';
import { DefineAttributeColumnOptions } from 'sequelize';
import { attr as TaskTeachingAttr } from '../model/task/teaching';
import { attr as PositionAttr, PositionType } from '../model/interships/position';
// import { FilterItemProps, SimpleFormItemType } from '../../../src/components/SimpleForm';

const NewPositionAttr = PositionAttr as {
  [key: string]: DefineAttributeColumnOptions;
};

export const filtersMap = {
  department_code: {
    id: 'department_code',
    title: '用工单位',
    type: SimpleFormItemType.Select,
    selectOptions: [] as any[],
  },
  name: {
    id: 'name',
    title: '岗位名称',
    type: SimpleFormItemType.Input,
  },
  audit: {
    id: 'audit',
    selectOptions: [] as any[],
    title: '审核环节',
    type: SimpleFormItemType.Select,
  },
  status: {
    id: 'status',
    selectOptions: NewPositionAttr.status.values!.map((title, index) => ({ value: index, title })),
    title: '岗位状态',
    type: SimpleFormItemType.Select,
  },
  campus: {
    id: 'campus',
    selectOptions: NewPositionAttr.campus.values!.map((title, index) => ({ value: index, title })),
    title: '校区',
    type: SimpleFormItemType.Select,
  },
  way: {
    id: 'way',
    selectOptions: NewPositionAttr.way.values!.map((title, index) => ({ value: index, title })),
    title: '聘用方式',
    type: SimpleFormItemType.Select,
  },
  student_type: {
    id: 'student_type',
    selectOptions: (TaskTeachingAttr.student_type as DefineAttributeColumnOptions).values!.map(
      (title, index) => ({ value: index, title }),
    ),
    title: '课程类型',
    type: SimpleFormItemType.Select,
  },
  semester: {
    id: 'semester',
    title: '学年学期',
    type: SimpleFormItemType.Select,
    selectOptions: [],
  },
};

export const filtersKeyMap: {
  [K in keyof typeof PositionType]: {
    [T in 'withStatus' | 'withoutStatus']: (keyof typeof filtersMap)[]
  }
} = {
  manage: {
    withStatus: ['department_code', 'audit', 'status', 'name', 'campus', 'way'],
    withoutStatus: ['department_code', 'name', 'campus', 'way'],
  },
  teach: {
    withStatus: ['department_code', 'audit', 'status', 'name', 'campus', 'way', 'student_type'],
    withoutStatus: ['department_code', 'name', 'campus', 'way', 'student_type'],
  },
};

export const getFilters = (keys: (keyof typeof filtersMap)[]): FilterItemProps[] =>
  keys.map(key => ({ ...filtersMap[key]! }));
