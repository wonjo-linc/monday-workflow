import { validateConfig } from './config/monday-config.js';
import { MondayService } from './services/monday-service.js';
import { BoardSetupWorkflow, BoardStructureConfig } from './workflows/board-setup.js';

interface TestResult {
  name: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  data?: any;
}

class MondayFeatureTester {
  private mondayService: MondayService;
  private workflow: BoardSetupWorkflow;
  private results: TestResult[] = [];
  private createdBoardId?: string;

  constructor() {
    this.mondayService = new MondayService();
    this.workflow = new BoardSetupWorkflow();
  }

  private addResult(result: TestResult) {
    this.results.push(result);
    const icon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
    console.log(`${icon} ${result.name}: ${result.message}`);
    if (result.data) {
      console.log('   Data:', JSON.stringify(result.data, null, 2));
    }
  }

  async testMe() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Get Current User Info (me)');
    console.log('='.repeat(60));

    try {
      const query = `
        query {
          me {
            id
            name
            email
            account {
              id
              name
            }
          }
        }
      `;

      const response = await (this.mondayService as any).executeQuery<{ me: any }>(query);
      this.addResult({
        name: 'Get Current User',
        status: 'success',
        message: `User: ${response.me.name} (${response.me.email})`,
        data: response.me
      });
      return true;
    } catch (error: any) {
      this.addResult({
        name: 'Get Current User',
        status: 'failed',
        message: error.message
      });
      return false;
    }
  }

  async testWorkspaces() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Get Workspaces');
    console.log('='.repeat(60));

    try {
      const workspaces = await this.mondayService.getWorkspaces();
      this.addResult({
        name: 'List Workspaces',
        status: 'success',
        message: `Found ${workspaces.length} workspace(s)`,
        data: workspaces
      });
      return workspaces;
    } catch (error: any) {
      this.addResult({
        name: 'List Workspaces',
        status: 'failed',
        message: error.message
      });
      return [];
    }
  }

  async testBoards(workspaceId?: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Get Boards');
    console.log('='.repeat(60));

    try {
      const boards = await this.mondayService.getBoards(workspaceId);
      this.addResult({
        name: 'List Boards',
        status: 'success',
        message: `Found ${boards.length} board(s)`,
        data: boards
      });
      return boards;
    } catch (error: any) {
      this.addResult({
        name: 'List Boards',
        status: 'failed',
        message: error.message
      });
      return [];
    }
  }

  async testCreateBoard(workspaceId?: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: Create Board');
    console.log('='.repeat(60));

    try {
      const boardName = `Test Board ${Date.now()}`;
      const board = await this.mondayService.createBoard(boardName, 'public', workspaceId);
      this.createdBoardId = board.id;
      this.addResult({
        name: 'Create Board',
        status: 'success',
        message: `Board created: ${board.name} (ID: ${board.id})`,
        data: board
      });
      return board;
    } catch (error: any) {
      this.addResult({
        name: 'Create Board',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  async testBoardColumns(boardId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Get Board Columns');
    console.log('='.repeat(60));

    try {
      const columns = await this.mondayService.getBoardColumns(boardId);
      this.addResult({
        name: 'Get Board Columns',
        status: 'success',
        message: `Found ${columns.length} column(s)`,
        data: columns
      });
      return columns;
    } catch (error: any) {
      this.addResult({
        name: 'Get Board Columns',
        status: 'failed',
        message: error.message
      });
      return [];
    }
  }

  async testCreateColumn(boardId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 6: Create Custom Column');
    console.log('='.repeat(60));

    try {
      const column = await this.mondayService.createColumn(
        boardId,
        'Test Status',
        'status',
        {
          labels: {
            0: 'Not Started',
            1: 'In Progress',
            2: 'Done'
          }
        }
      );
      this.addResult({
        name: 'Create Column',
        status: 'success',
        message: `Column created: ${column.title} (Type: ${column.type})`,
        data: column
      });
      return column;
    } catch (error: any) {
      this.addResult({
        name: 'Create Column',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  async testBoardGroups(boardId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 7: Get Board Groups');
    console.log('='.repeat(60));

    try {
      const groups = await this.mondayService.getBoardGroups(boardId);
      this.addResult({
        name: 'Get Board Groups',
        status: 'success',
        message: `Found ${groups.length} group(s)`,
        data: groups
      });
      return groups;
    } catch (error: any) {
      this.addResult({
        name: 'Get Board Groups',
        status: 'failed',
        message: error.message
      });
      return [];
    }
  }

  async testCreateGroup(boardId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 8: Create Group');
    console.log('='.repeat(60));

    try {
      const group = await this.mondayService.createGroup(boardId, 'Test Group');
      this.addResult({
        name: 'Create Group',
        status: 'success',
        message: `Group created: ${group.title} (ID: ${group.id})`,
        data: group
      });
      return group;
    } catch (error: any) {
      this.addResult({
        name: 'Create Group',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  async testCreateItem(boardId: string, groupId?: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 9: Create Item');
    console.log('='.repeat(60));

    try {
      const item = await this.mondayService.createItem(
        boardId,
        'Test Item',
        groupId
      );
      this.addResult({
        name: 'Create Item',
        status: 'success',
        message: `Item created: ${item.name} (ID: ${item.id})`,
        data: item
      });
      return item;
    } catch (error: any) {
      this.addResult({
        name: 'Create Item',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  async testGetBoardItems(boardId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 10: Get Board Items');
    console.log('='.repeat(60));

    try {
      const items = await this.mondayService.getBoardItems(boardId);
      this.addResult({
        name: 'Get Board Items',
        status: 'success',
        message: `Found ${items.length} item(s)`,
        data: items
      });
      return items;
    } catch (error: any) {
      this.addResult({
        name: 'Get Board Items',
        status: 'failed',
        message: error.message
      });
      return [];
    }
  }

  async testUpdateColumnValue(boardId: string, itemId: string, columnId: string) {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 11: Update Column Value');
    console.log('='.repeat(60));

    try {
      const item = await this.mondayService.updateColumnValue(
        boardId,
        itemId,
        columnId,
        { label: 1 }
      );
      this.addResult({
        name: 'Update Column Value',
        status: 'success',
        message: `Column updated for item: ${item.name}`,
        data: item
      });
      return item;
    } catch (error: any) {
      this.addResult({
        name: 'Update Column Value',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  async testBoardStructureWorkflow() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST 12: Board Structure Workflow');
    console.log('='.repeat(60));

    try {
      const config: BoardStructureConfig = {
        name: `Workflow Test Board ${Date.now()}`,
        description: 'Test board created by automated workflow',
        groups: [
          {
            name: 'Planning',
            items: [
              { name: 'Define scope' },
              { name: 'Create timeline' }
            ]
          },
          {
            name: 'In Progress',
            items: [
              { name: 'Development' }
            ]
          },
          {
            name: 'Completed',
            items: []
          }
        ],
        columns: [
          {
            title: 'Priority',
            type: 'status',
            defaults: {
              labels: {
                0: 'Low',
                1: 'Medium',
                2: 'High'
              }
            }
          },
          {
            title: 'Due Date',
            type: 'date'
          }
        ]
      };

      const board = await this.workflow.createBoardStructure(config);
      this.addResult({
        name: 'Board Structure Workflow',
        status: 'success',
        message: `Complete board structure created: ${board.name}`,
        data: { boardId: board.id }
      });

      // Display the created board structure
      await this.workflow.displayBoardStructure(board.id);

      return board;
    } catch (error: any) {
      this.addResult({
        name: 'Board Structure Workflow',
        status: 'failed',
        message: error.message
      });
      return null;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));

    const successCount = this.results.filter(r => r.status === 'success').length;
    const failedCount = this.results.filter(r => r.status === 'failed').length;
    const skippedCount = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;

    console.log(`\nTotal Tests: ${total}`);
    console.log(`✅ Passed: ${successCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`\nSuccess Rate: ${((successCount / total) * 100).toFixed(1)}%`);

    console.log('\n' + '-'.repeat(60));
    console.log('Detailed Results:');
    console.log('-'.repeat(60));
    this.results.forEach((result, index) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
      console.log(`${index + 1}. ${icon} ${result.name}`);
      console.log(`   ${result.message}`);
    });
  }

  async runAllTests() {
    console.log('\n' + '█'.repeat(60));
    console.log('MONDAY.COM COMPREHENSIVE FEATURE TEST');
    console.log('█'.repeat(60));

    try {
      validateConfig();
      console.log('✓ Configuration validated\n');
    } catch (error: any) {
      console.error('❌ Configuration error:', error.message);
      process.exit(1);
    }

    // Test 1: User info (should work with me:write)
    const meSuccess = await this.testMe();

    // Test 2: Workspaces
    const workspaces = await this.testWorkspaces();

    // Test 3: Boards
    const boards = await this.testBoards();

    // Test 4: Create a test board
    const newBoard = await this.testCreateBoard();

    if (newBoard) {
      // Test 5: Get columns
      const columns = await this.testBoardColumns(newBoard.id);

      // Test 6: Create custom column
      const newColumn = await this.testCreateColumn(newBoard.id);

      // Test 7: Get groups
      const groups = await this.testBoardGroups(newBoard.id);

      // Test 8: Create group
      const newGroup = await this.testCreateGroup(newBoard.id);

      // Test 9: Create item
      let item = null;
      if (newGroup) {
        item = await this.testCreateItem(newBoard.id, newGroup.id);
      } else if (groups.length > 0) {
        item = await this.testCreateItem(newBoard.id, groups[0].id);
      }

      // Test 10: Get all items
      await this.testGetBoardItems(newBoard.id);

      // Test 11: Update column value
      if (item && newColumn) {
        await this.testUpdateColumnValue(newBoard.id, item.id, newColumn.id);
      }
    }

    // Test 12: Full workflow test
    await this.testBoardStructureWorkflow();

    // Print summary
    this.printSummary();

    console.log('\n' + '█'.repeat(60));
    console.log('TEST COMPLETED');
    console.log('█'.repeat(60) + '\n');
  }
}

async function main() {
  const tester = new MondayFeatureTester();
  await tester.runAllTests();
}

main();
