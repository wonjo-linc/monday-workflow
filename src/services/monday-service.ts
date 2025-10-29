import axios, { AxiosInstance } from 'axios';
import { mondayConfig } from '../config/monday-config.js';
import type {
  Board,
  BoardColumn,
  BoardGroup,
  BoardItem,
  Workspace,
  MondayResponse
} from '../types/monday.types.js';

export class MondayService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: mondayConfig.apiUrl,
      headers: {
        'Authorization': mondayConfig.apiToken,
        'Content-Type': 'application/json'
      }
    });
  }

  private async executeQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.post('', {
        query,
        variables
      });

      if (response.data.errors) {
        throw new Error(`Monday API Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Monday API Request Failed: ${error.message}`);
      }
      throw error;
    }
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const query = `
      query {
        workspaces {
          id
          name
          description
        }
      }
    `;

    const data = await this.executeQuery<{ workspaces: Workspace[] }>(query);
    return data.workspaces;
  }

  async getBoards(workspaceId?: string): Promise<Board[]> {
    const query = `
      query ($workspaceIds: [ID]) {
        boards(workspace_ids: $workspaceIds) {
          id
          name
          description
          workspace_id
          board_kind
        }
      }
    `;

    const variables = workspaceId ? { workspaceIds: [workspaceId] } : undefined;
    const data = await this.executeQuery<{ boards: Board[] }>(query, variables);
    return data.boards;
  }

  async createBoard(
    boardName: string,
    boardKind: string = 'public',
    workspaceId?: string
  ): Promise<Board> {
    const query = `
      mutation ($boardName: String!, $boardKind: BoardKind!, $workspaceId: ID) {
        create_board(
          board_name: $boardName,
          board_kind: $boardKind,
          workspace_id: $workspaceId
        ) {
          id
          name
          description
          workspace_id
          board_kind
        }
      }
    `;

    const variables = {
      boardName,
      boardKind,
      ...(workspaceId && { workspaceId })
    };

    const data = await this.executeQuery<{ create_board: Board }>(query, variables);
    return data.create_board;
  }

  async getBoardColumns(boardId: string): Promise<BoardColumn[]> {
    const query = `
      query ($boardId: [ID!]) {
        boards(ids: $boardId) {
          columns {
            id
            title
            type
            settings_str
          }
        }
      }
    `;

    const data = await this.executeQuery<{ boards: Array<{ columns: BoardColumn[] }> }>(
      query,
      { boardId: [boardId] }
    );

    return data.boards[0]?.columns || [];
  }

  async createColumn(
    boardId: string,
    title: string,
    columnType: string,
    defaults?: Record<string, any>
  ): Promise<BoardColumn> {
    const query = `
      mutation ($boardId: ID!, $title: String!, $columnType: ColumnType!, $defaults: JSON) {
        create_column(
          board_id: $boardId,
          title: $title,
          column_type: $columnType,
          defaults: $defaults
        ) {
          id
          title
          type
          settings_str
        }
      }
    `;

    const variables = {
      boardId,
      title,
      columnType,
      ...(defaults && { defaults: JSON.stringify(defaults) })
    };

    const data = await this.executeQuery<{ create_column: BoardColumn }>(query, variables);
    return data.create_column;
  }

  async getBoardGroups(boardId: string): Promise<BoardGroup[]> {
    const query = `
      query ($boardId: [ID!]) {
        boards(ids: $boardId) {
          groups {
            id
            title
            color
          }
        }
      }
    `;

    const data = await this.executeQuery<{ boards: Array<{ groups: BoardGroup[] }> }>(
      query,
      { boardId: [boardId] }
    );

    return data.boards[0]?.groups || [];
  }

  async createGroup(
    boardId: string,
    groupName: string
  ): Promise<BoardGroup> {
    const query = `
      mutation ($boardId: ID!, $groupName: String!) {
        create_group(board_id: $boardId, group_name: $groupName) {
          id
          title
          color
        }
      }
    `;

    const data = await this.executeQuery<{ create_group: BoardGroup }>(
      query,
      { boardId, groupName }
    );

    return data.create_group;
  }

  async createItem(
    boardId: string,
    itemName: string,
    groupId?: string,
    columnValues?: Record<string, any>
  ): Promise<BoardItem> {
    const query = `
      mutation ($boardId: ID!, $itemName: String!, $groupId: String, $columnValues: JSON) {
        create_item(
          board_id: $boardId,
          item_name: $itemName,
          group_id: $groupId,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `;

    const variables = {
      boardId,
      itemName,
      ...(groupId && { groupId }),
      ...(columnValues && { columnValues: JSON.stringify(columnValues) })
    };

    const data = await this.executeQuery<{ create_item: BoardItem }>(query, variables);
    return data.create_item;
  }

  async getBoardItems(boardId: string): Promise<BoardItem[]> {
    const query = `
      query ($boardId: [ID!]) {
        boards(ids: $boardId) {
          items_page {
            items {
              id
              name
              group {
                id
              }
              column_values {
                id
                value
                text
              }
            }
          }
        }
      }
    `;

    const data = await this.executeQuery<{
      boards: Array<{ items_page: { items: BoardItem[] } }>
    }>(query, { boardId: [boardId] });

    return data.boards[0]?.items_page?.items || [];
  }

  async updateColumnValue(
    boardId: string,
    itemId: string,
    columnId: string,
    value: any
  ): Promise<BoardItem> {
    const query = `
      mutation ($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(
          board_id: $boardId,
          item_id: $itemId,
          column_id: $columnId,
          value: $value
        ) {
          id
          name
        }
      }
    `;

    const variables = {
      boardId,
      itemId,
      columnId,
      value: JSON.stringify(value)
    };

    const data = await this.executeQuery<{ change_column_value: BoardItem }>(query, variables);
    return data.change_column_value;
  }
}
