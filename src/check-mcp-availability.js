#!/usr/bin/env node

// Check if monday.com MCP tools are available
// This script checks for available MCP tools in the environment

console.log('Checking for Monday.com MCP tools...\n');

// Check environment variables
console.log('Environment Check:');
const mcpVars = Object.keys(process.env).filter(key =>
  key.toLowerCase().includes('mcp') || key.toLowerCase().includes('monday')
);

if (mcpVars.length > 0) {
  console.log('Found MCP-related environment variables:');
  mcpVars.forEach(key => {
    const value = process.env[key];
    console.log(`  ${key}: ${value?.substring(0, 50)}${value && value.length > 50 ? '...' : ''}`);
  });
} else {
  console.log('  No MCP-related environment variables found');
}

console.log('\n' + '='.repeat(60));
console.log('MONDAY.COM MCP vs DIRECT API COMPARISON');
console.log('='.repeat(60));

console.log('\n📱 Claude Web UI (Working):');
console.log('  - Uses Monday.com MCP Server');
console.log('  - URL: https://mcp.monday.com/sse');
console.log('  - Authentication: OAuth 2.0');
console.log('  - Full access to workspace through OAuth permissions');

console.log('\n💻 Claude Code (Current Implementation):');
console.log('  - Uses Direct GraphQL API');
console.log('  - URL: https://api.monday.com/v2');
console.log('  - Authentication: Personal API Token (JWT)');
console.log('  - Requires token with proper scopes');

console.log('\n🔑 Current Token Analysis:');
console.log('  - Format: JWT (Personal API Token)');
console.log('  - Scopes: me:write (INSUFFICIENT)');
console.log('  - Status: Cannot access boards/workspaces');

console.log('\n' + '='.repeat(60));
console.log('SOLUTIONS');
console.log('='.repeat(60));

console.log('\n✅ Solution 1: Use Monday.com MCP (Recommended)');
console.log('  If Monday.com MCP is connected to Claude Code:');
console.log('  - The code can call MCP tools directly');
console.log('  - OAuth authentication is handled by MCP server');
console.log('  - Same experience as Claude Web UI');

console.log('\n✅ Solution 2: Generate New Personal API Token');
console.log('  Create new token with required scopes:');
console.log('  - boards:read');
console.log('  - boards:write');
console.log('  - workspaces:read');
console.log('  Guide: TOKEN_SETUP_GUIDE.md');

console.log('\n' + '='.repeat(60));
console.log('CHECKING MCP AVAILABILITY');
console.log('='.repeat(60));

console.log('\nNote: In Claude Code environment, MCP tools are not');
console.log('directly accessible from Node.js scripts. MCP tools are');
console.log('available through the Claude Code agent interface.');

console.log('\nTo use Monday.com MCP in Claude Code:');
console.log('1. Ensure Monday.com MCP server is connected');
console.log('2. Ask Claude to use Monday.com MCP tools');
console.log('3. Claude will use the OAuth-authenticated MCP connection');

console.log('\n' + '='.repeat(60));
console.log('\nFor Direct API access (current approach):');
console.log('  → You need a new Personal API Token');
console.log('  → Follow: TOKEN_SETUP_GUIDE.md');
console.log('\nFor MCP access (like Web UI):');
console.log('  → Ask: "Use Monday.com MCP tools to list my boards"');
console.log('  → MCP handles OAuth authentication automatically');
console.log('='.repeat(60) + '\n');
