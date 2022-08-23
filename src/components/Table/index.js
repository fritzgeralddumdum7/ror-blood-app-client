import React from 'react';
import { createSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Table as MantineTable,
  Text,
  Stack,
  Group,
  Pagination
} from '@mantine/core';

const Table = ({ children, columns, rows = [], dispatchHandler, maxPage = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack>
      <Stack>
        <Card shadow="sm" styles={() => ({
          root: { overflow: 'auto !important' }
        })}>
          <MantineTable striped highlightOnHover>
            <thead>
              <tr>
                {columns.map(col => <th>{col}</th>)}
              </tr>
            </thead>
            {
              rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Text align='center' pt={15}>No data available</Text>
                  </td>
                </tr>
              ) : children
            }
          </MantineTable>
        </Card>
      </Stack>
      {
        maxPage > 0 && (
          <Group position='right'>
            <Pagination
              total={maxPage}
              onChange={(page) => {
                navigate({
                  pathname: location.pathname,
                  search: createSearchParams({ page }).toString()
                });
                dispatchHandler({ page });
              }}
            />
          </Group>
        )
      }
    </Stack>
  )
}

export default Table;
