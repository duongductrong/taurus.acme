"use client"

import { FilterWizard } from "@/components/ant-ui/pro-ui/filter-wizard"
import { Field } from "@/components/ant-ui/pro-ui/form-wizard/field"
import { PageBody, PageCard, PageFragment, PageTitle } from "@/components/ant-ui/sections/page"
import { Card } from "@/components/ant-ui/ui/card"
import { Flex } from "@/components/ant-ui/ui/flex"
import { Col, Row } from "@/components/ant-ui/ui/grid"
import { Statistic } from "@/components/ant-ui/ui/statistic"
import { Table, TableProps } from "@/components/ant-ui/ui/table"
import { Link } from "@/components/router/link"
import { PAGE_URLS } from "@/constants/urls"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectProps, Space, Tag } from "antd"
import { createStyles } from "antd-style"
import { Filter, Package2, PieChart, User } from "lucide-react"
import { useState } from "react"
import { Form } from "hookform-field"
import { z } from "zod"

const filterSchema = z.object({ search: z.string().nullish(), showFields: z.any() })

export type FilterSchemaInferred = z.infer<typeof filterSchema>

export interface OrderListProps {}

interface OrderType {
  key: string
  orderId: string
  customerName: string
  orderDate: string
  status: string
  totalAmount: number
  tags: string[]
}

const columns: TableProps<OrderType>["columns"] = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    render: (text, record) => (
      <Link
        href={PAGE_URLS.ADMIN.ORDERS_VIEW}
        as={PAGE_URLS.ADMIN.ORDERS_VIEW.replace("[id]", record.orderId)}
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = status === "Delivered" ? "green" : status === "Pending" ? "geekblue" : "volcano"
      return <Tag color={color}>{status.toUpperCase()}</Tag>
    },
  },
  {
    title: "Total Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (amount) => `$${amount?.toFixed(2)}`,
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green"
          if (tag === "urgent") {
            color = "volcano"
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>View {record.orderId}</a>
        <a>Delete</a>
      </Space>
    ),
  },
]

const data: OrderType[] = Array.from({ length: 100 }, (_, index) => ({
  key: `ORD${1000 + index}`,
  orderId: `ORD${1000 + index}`,
  customerName: `Customer ${index + 1}`,
  orderDate: new Date().toLocaleDateString(),
  status: index % 3 === 0 ? "Delivered" : index % 2 === 0 ? "Pending" : "Cancelled",
  totalAmount: index * 14.2 * 1000,
  tags: index % 2 === 0 ? ["new", "important"] : ["regular", "urgent"],
}))

interface ItemProps {
  label: string
  value: string
}

const options: ItemProps[] = []

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i
  options.push({
    label: `Long Label: ${value}`,
    value,
  })
}

const sharedProps: SelectProps = {
  mode: "multiple",
  style: { width: "300px" },
  options,
  placeholder: "Select Item...",
  maxTagCount: "responsive",
}

const OrderList = (props: OrderListProps) => {
  const { cx, styles } = useStyles()

  const [value, setValue] = useState(["a10", "c12", "h17", "j19", "k20"])

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  }

  return (
    <PageFragment>
      <Form<FilterSchemaInferred>
        resolver={zodResolver(filterSchema)}
        onSubmit={(values) => console.log(values)}
      >
        <PageBody component={Flex} impact vertical>
          <PageTitle title="Orders" description="Manage your orders so easy and quickly" isCard />

          <PageCard>
            <Row gutter={16}>
              <Col span={4}>
                <Card>
                  <Statistic title="Total orders" value={1083} />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic title="Total profit" value={112893} suffix="$" />
                </Card>
              </Col>
            </Row>
          </PageCard>
          <PageCard component={Flex} justify="space-between" withGapBottom>
            <Flex gap={12}>
              <Field component="text" name="search" placeholder="Search..." allowClear />
              <FilterWizard
                icon={<Filter size={14} />}
                attributes={[
                  {
                    icon: <Package2 size={14} />,
                    key: "orderId",
                    label: "Order ID",
                    type: "text",
                  },
                  {
                    icon: <User size={14} />,
                    key: "customerName",
                    label: "Customer Name",
                    type: "text",
                  },
                  {
                    icon: <PieChart size={14} />,
                    key: "status",
                    label: "Status",
                    type: "select",
                  },
                ]}
              />
            </Flex>

            <Field
              component="select"
              name="showFields"
              {...sharedProps}
              placeholder="Show fields"
            />
          </PageCard>
          <Table className={cx(styles.table)} columns={columns} dataSource={data} impact />
        </PageBody>
      </Form>
    </PageFragment>
  )
}

const useStyles = createStyles(({ token }) => ({
  card: {},
  segments: {},
  table: {},
}))

export default OrderList
