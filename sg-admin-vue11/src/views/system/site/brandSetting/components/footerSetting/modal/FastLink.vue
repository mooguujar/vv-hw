<template>
  <Form>
    <Row :gutter="24">
      <Col :span="12">
        <Checkbox>
          <FormItem label="Facebook">
            <Input value="777777" />
          </FormItem>
        </Checkbox>
      </Col>
      <Col :span="12">
        <Checkbox>
          <FormItem label="Facebook">
            <Input value="777777" />
          </FormItem>
        </Checkbox>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <Checkbox>
          <FormItem label="Facebook">
            <Input value="777777" />
          </FormItem>
        </Checkbox>
      </Col>
      <Col :span="12">
        <Checkbox>
          <FormItem label="Facebook">
            <Input value="777777" />
          </FormItem>
        </Checkbox>
      </Col>
    </Row>
  </Form>
</template>
<script lang="ts" setup>
  import { Form, FormItem, Input, Row, Col, Checkbox } from 'ant-design-vue';
</script>
