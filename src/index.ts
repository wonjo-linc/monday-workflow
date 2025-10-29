import { validateConfig } from './config/monday-config.js';
import { BoardSetupWorkflow, BoardStructureConfig } from './workflows/board-setup.js';

async function main() {
  try {
    // Validate configuration
    validateConfig();
    console.log('✓ Configuration validated');

    // Initialize workflow
    const workflow = new BoardSetupWorkflow();

    // List all workspaces
    await workflow.listWorkspaces();

    // List all boards
    console.log('\n');
    await workflow.listBoards();

    // Example: Create a project management board structure
    const projectBoardConfig: BoardStructureConfig = {
      name: 'Project Management Board',
      description: 'Main project tracking board',
      groups: [
        {
          name: 'Planning',
          items: [
            { name: 'Define project scope' },
            { name: 'Create timeline' },
            { name: 'Assign team members' }
          ]
        },
        {
          name: 'In Progress',
          items: [
            { name: 'Development phase 1' },
            { name: 'Design mockups' }
          ]
        },
        {
          name: 'Review',
          items: [
            { name: 'Code review' },
            { name: 'QA testing' }
          ]
        },
        {
          name: 'Completed',
          items: []
        }
      ],
      columns: [
        {
          title: 'Status',
          type: 'status',
          defaults: {
            labels: {
              0: 'Not Started',
              1: 'In Progress',
              2: 'Blocked',
              3: 'Done'
            }
          }
        },
        {
          title: 'Priority',
          type: 'status',
          defaults: {
            labels: {
              0: 'Low',
              1: 'Medium',
              2: 'High',
              3: 'Critical'
            }
          }
        },
        {
          title: 'Due Date',
          type: 'date'
        },
        {
          title: 'Owner',
          type: 'people'
        },
        {
          title: 'Notes',
          type: 'long_text'
        }
      ]
    };

    // Uncomment to create the board
    // console.log('\n\n=== Creating Sample Board ===');
    // const board = await workflow.createBoardStructure(projectBoardConfig);
    // await workflow.displayBoardStructure(board.id);

    console.log('\n✓ Workflow completed successfully');
    console.log('\nTo create a sample board, uncomment the board creation code in src/index.ts');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
