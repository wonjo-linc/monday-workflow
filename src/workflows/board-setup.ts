import { MondayService } from '../services/monday-service.js';
import type { Board, BoardColumn, BoardGroup } from '../types/monday.types.js';

export interface BoardStructureConfig {
  name: string;
  description?: string;
  workspaceId?: string;
  groups: Array<{
    name: string;
    items?: Array<{
      name: string;
      columnValues?: Record<string, any>;
    }>;
  }>;
  columns: Array<{
    title: string;
    type: string;
    defaults?: Record<string, any>;
  }>;
}

export class BoardSetupWorkflow {
  private mondayService: MondayService;

  constructor() {
    this.mondayService = new MondayService();
  }

  async listWorkspaces(): Promise<void> {
    console.log('\n=== Listing Workspaces ===');
    const workspaces = await this.mondayService.getWorkspaces();

    if (workspaces.length === 0) {
      console.log('No workspaces found.');
      return;
    }

    workspaces.forEach((workspace, index) => {
      console.log(`\n${index + 1}. Workspace:`);
      console.log(`   ID: ${workspace.id}`);
      console.log(`   Name: ${workspace.name}`);
      if (workspace.description) {
        console.log(`   Description: ${workspace.description}`);
      }
    });
  }

  async listBoards(workspaceId?: string): Promise<void> {
    console.log('\n=== Listing Boards ===');
    const boards = await this.mondayService.getBoards(workspaceId);

    if (boards.length === 0) {
      console.log('No boards found.');
      return;
    }

    boards.forEach((board, index) => {
      console.log(`\n${index + 1}. Board:`);
      console.log(`   ID: ${board.id}`);
      console.log(`   Name: ${board.name}`);
      if (board.description) {
        console.log(`   Description: ${board.description}`);
      }
      if (board.workspace_id) {
        console.log(`   Workspace ID: ${board.workspace_id}`);
      }
    });
  }

  async createBoardStructure(config: BoardStructureConfig): Promise<Board> {
    console.log(`\n=== Creating Board: ${config.name} ===`);

    // Create the board
    const board = await this.mondayService.createBoard(
      config.name,
      'public',
      config.workspaceId
    );
    console.log(`✓ Board created: ${board.name} (ID: ${board.id})`);

    // Create custom columns
    if (config.columns && config.columns.length > 0) {
      console.log('\n--- Creating Columns ---');
      for (const columnConfig of config.columns) {
        try {
          const column = await this.mondayService.createColumn(
            board.id,
            columnConfig.title,
            columnConfig.type,
            columnConfig.defaults
          );
          console.log(`✓ Column created: ${column.title} (Type: ${column.type})`);
        } catch (error) {
          console.error(`✗ Failed to create column ${columnConfig.title}:`, error);
        }
      }
    }

    // Get current groups (Monday creates a default group)
    const existingGroups = await this.mondayService.getBoardGroups(board.id);
    console.log(`\n--- Existing Groups: ${existingGroups.length} ---`);

    // Create custom groups and items
    if (config.groups && config.groups.length > 0) {
      console.log('\n--- Creating Groups and Items ---');
      for (const groupConfig of config.groups) {
        try {
          const group = await this.mondayService.createGroup(
            board.id,
            groupConfig.name
          );
          console.log(`✓ Group created: ${group.title} (ID: ${group.id})`);

          // Create items in the group
          if (groupConfig.items && groupConfig.items.length > 0) {
            for (const itemConfig of groupConfig.items) {
              try {
                const item = await this.mondayService.createItem(
                  board.id,
                  itemConfig.name,
                  group.id,
                  itemConfig.columnValues
                );
                console.log(`  ✓ Item created: ${item.name}`);
              } catch (error) {
                console.error(`  ✗ Failed to create item ${itemConfig.name}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`✗ Failed to create group ${groupConfig.name}:`, error);
        }
      }
    }

    console.log(`\n=== Board Structure Complete ===\n`);
    return board;
  }

  async displayBoardStructure(boardId: string): Promise<void> {
    console.log('\n=== Board Structure ===');

    // Get columns
    const columns = await this.mondayService.getBoardColumns(boardId);
    console.log('\n--- Columns ---');
    columns.forEach((column, index) => {
      console.log(`${index + 1}. ${column.title} (Type: ${column.type}, ID: ${column.id})`);
    });

    // Get groups
    const groups = await this.mondayService.getBoardGroups(boardId);
    console.log('\n--- Groups ---');
    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.title} (ID: ${group.id}, Color: ${group.color || 'N/A'})`);
    });

    // Get items
    const items = await this.mondayService.getBoardItems(boardId);
    console.log('\n--- Items ---');
    if (items.length === 0) {
      console.log('No items found.');
    } else {
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} (ID: ${item.id}, Group: ${item.group?.id || 'N/A'})`);
      });
    }
  }
}
