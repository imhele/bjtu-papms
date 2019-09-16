import React from 'react';
import styles from './Detail.less';
import QueueAnim from 'rc-queue-anim';
import { ButtonProps } from 'antd/es/button';
import { Badge, Button, Card, Modal, Skeleton, Tabs, Tag, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import Steps, { StepsProps } from '@/components/Steps';
import { PositionDetailProps } from '@/models/position';
import { StandardTableAction } from '@/components/StandardTable';
import DescriptionList, { DescriptionProps } from '@/components/DescriptionList';

export interface DetailProps extends PositionDetailProps {
  currentRow?: object;
  currentRowKey?: string | number;
  loading?: boolean;
  onClickAction?: (
    rowKey: string | number,
    actionType: string,
    currentRow: object,
    event: React.MouseEvent,
  ) => void;
  onClose?: () => void;
  renderFooterProps?: (action: StandardTableAction, currentRowKey: string | number) => ButtonProps;
  stepsProps?: StepsProps;
  visible?: boolean;
}

const renderFooter = (props: DetailProps): React.ReactNode => {
  const actionKey = Array.isArray(props.actionKey) ? props.actionKey : [props.actionKey];
  const actionArr: StandardTableAction[] = [];
  if (props.currentRow) {
    actionKey.forEach(key => {
      if (typeof props.currentRow[key] === 'string') return;
      if (props.currentRow[key]) {
        if (Array.isArray(props.currentRow[key])) {
          actionArr.push(...props.currentRow[key]);
        } else {
          actionArr.push(props.currentRow[key]);
        }
      }
    });
  }
  /**
   * `delay` in `<QueueAnim />`:
   * When user clicks to close the modal, `actionArr` will turn to `[]`,
   * and then he will see the buttons disappear immediately
   * before the modal box closes completely.
   * So give it a `delay` to make it look less strange.
   */
  return (
    <QueueAnim delay={[0, 500]} type="right">
      {actionArr
        .map(action => (
          <div className={styles.footerButton} key={action.type}>
            <Button
              icon={action.icon}
              onClick={(event: React.MouseEvent) =>
                props.onClickAction(props.currentRowKey, action.type, props.currentRow, event)
              }
              {...props.renderFooterProps(action, props.currentRowKey)}
            >
              {action.text || action.type}
            </Button>
          </div>
        ))
        .concat(
          <div className={styles.footerButton} key="Close">
            <Button onClick={props.onClose} type="primary">
              <FormattedMessage id="word.close" />
            </Button>
          </div>,
        )}
    </QueueAnim>
  );
};

const renderDescitem = (
  columns: { dataIndex: string; title: string }[],
  dataSource: { [key: string]: string },
): DescriptionProps[] =>
  columns.map(
    ({ dataIndex, title, ...restProps }): DescriptionProps => ({
      children: dataSource[dataIndex],
      key: dataIndex,
      term: title,
      ...restProps
    }),
  );

const tableRender = (props: DetailProps): React.ReactNode => (
  <Skeleton active loading={props.loading} paragraph={{ rows: 7 }}>
    {props.stepsProps && <Steps className={styles.steps} {...props.stepsProps} />}
    <DescriptionList description={renderDescitem(props.columns, props.dataSource)} />
  </Skeleton>
);

const cardGroupByKeys = {
  basic: ['name', 'semester', 'department_name', 'staff_name'],
  demands: ['start_t', 'end_t', 'address', 'work_time_d', 'content', 'need'],
  audit: ['status', 'audit', 'audit_log'],
  exclude: ['campus', 'need_num', 'way', 'work_time_l', 'types'],
};

const getCardGroupBy = (columns: { dataIndex: string; title: string }[]) => {
  const colsObj: { [key: string]: any } = {};
  columns.forEach(col => (colsObj[col.dataIndex] = col));
  const groupBy = {} as { [key in keyof typeof cardGroupByKeys]: any[] };
  Object.keys(cardGroupByKeys).forEach((key: keyof typeof cardGroupByKeys) => {
    groupBy[key] = cardGroupByKeys[key].map(key => {
      const col = colsObj[key];
      delete colsObj[key];
      return col;
    });
    groupBy[key] = groupBy[key].filter(col => !!col);
  });
  const restCols = Object.keys(colsObj).map(k => colsObj[k]);
  return { colsObj, groupBy, restCols };
};

const cardTag = (dataSource: any, column?: any, color?: string) => {
  if (!column) return null;
  return (
    <Tooltip title={column.title}>
      <Tag color={color}>{dataSource[column.dataIndex]}</Tag>
    </Tooltip>
  );
};

const cardBadge = (dataSource: any, column?: any, color?: string, suffix?: string) => {
  if (!column) return null;
  const content = (
    <React.Fragment>
      <span>{column.title}：</span>
      <span>{dataSource[column.dataIndex]}</span>
      {suffix && <span style={{ marginLeft: 4 }}>{suffix}</span>}
    </React.Fragment>
  );
  return <Badge count={content} style={color && { backgroundColor: color }} />;
};

const cardRender = (props: DetailProps): React.ReactNode => {
  const { dataSource: ds = {} } = props;
  const { colsObj, groupBy, restCols } = getCardGroupBy(props.columns);
  return (
    <Skeleton active loading={props.loading} paragraph={{ rows: 2 }}>
      {props.stepsProps && <Steps className={styles.steps} {...props.stepsProps} />}
      <Card
        loading={props.loading}
        title={
          <div>
            <span>基本信息</span>
            {cardTag(ds, colsObj.campus, '#2db7f5')}
            {cardTag(ds, colsObj.way, '#52c41a')}
            {cardTag(ds, colsObj.types, '#722ed1')}
          </div>
        }
        type="inner"
      >
        <DescriptionList description={renderDescitem(groupBy.basic, ds)} />
      </Card>
      <Card
        loading={props.loading}
        title={
          <div>
            <span>需求信息</span>
            {cardBadge(ds, colsObj.need_num, '#13c2c2', '人')}
            {cardBadge(ds, colsObj.work_time_l, '#fa8c16', '小时 / 人周')}
          </div>
        }
        type="inner"
      >
        <DescriptionList
          col={2}
          description={renderDescitem(groupBy.demands, ds)}
        />
      </Card>
      {ds.status && (
        <Card loading={props.loading} title="审核信息" type="inner">
          <DescriptionList
            col={2}
            description={renderDescitem(groupBy.audit, ds)}
          />
        </Card>
      )}
      {restCols.length && (
        <Card loading={props.loading} title="其他" type="inner">
          <DescriptionList
            col={2}
            description={renderDescitem(restCols, ds)}
          />
        </Card>
      )}
    </Skeleton>
  );
};

const Detail: React.SFC<DetailProps> = props => (
  <Modal
    className={styles.modal}
    footer={renderFooter(props)}
    onCancel={props.onClose}
    title={<FormattedMessage id="position.detail" />}
    visible={props.visible}
  >
    <Tabs defaultActiveKey="card">
      <Tabs.TabPane key="card" tab="新版">{cardRender(props)}</Tabs.TabPane>
      <Tabs.TabPane key="table" tab="旧版">{tableRender(props)}</Tabs.TabPane>
    </Tabs>
  </Modal>
);

Detail.defaultProps = {
  actionKey: 'action',
  columns: [],
  dataSource: {},
  currentRow: null,
  currentRowKey: null,
  loading: false,
  onClickAction: () => {},
  onClose: () => {},
  renderFooterProps: () => null,
  visible: false,
};

export default Detail;
