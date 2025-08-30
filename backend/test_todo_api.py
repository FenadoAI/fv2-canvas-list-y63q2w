import asyncio
import aiohttp
import json

API_BASE = "http://localhost:8001"  # Backend is running on port 8001
API = f"{API_BASE}/api"

async def test_todo_api():
    async with aiohttp.ClientSession() as session:
        print("Testing Todo API endpoints...")
        
        # Test 1: Create a new todo
        print("\n1. Creating a new todo...")
        todo_data = {
            "title": "Test Todo",
            "description": "This is a test todo item"
        }
        
        async with session.post(f"{API}/todos", json=todo_data) as response:
            if response.status == 200:
                created_todo = await response.json()
                print(f"✅ Todo created successfully: {created_todo['title']}")
                todo_id = created_todo['id']
            else:
                print(f"❌ Failed to create todo: {response.status}")
                return
        
        # Test 2: Get all todos
        print("\n2. Getting all todos...")
        async with session.get(f"{API}/todos") as response:
            if response.status == 200:
                todos = await response.json()
                print(f"✅ Retrieved {len(todos)} todos")
                for todo in todos[:3]:  # Show first 3
                    print(f"   - {todo['title']} (completed: {todo['completed']})")
            else:
                print(f"❌ Failed to get todos: {response.status}")
        
        # Test 3: Update the todo
        print("\n3. Updating the todo...")
        update_data = {
            "title": "Updated Test Todo",
            "completed": True
        }
        
        async with session.put(f"{API}/todos/{todo_id}", json=update_data) as response:
            if response.status == 200:
                updated_todo = await response.json()
                print(f"✅ Todo updated: {updated_todo['title']} (completed: {updated_todo['completed']})")
            else:
                print(f"❌ Failed to update todo: {response.status}")
        
        # Test 4: Get specific todo
        print("\n4. Getting specific todo...")
        async with session.get(f"{API}/todos/{todo_id}") as response:
            if response.status == 200:
                todo = await response.json()
                print(f"✅ Retrieved todo: {todo['title']}")
            else:
                print(f"❌ Failed to get specific todo: {response.status}")
        
        # Test 5: Delete the todo
        print("\n5. Deleting the todo...")
        async with session.delete(f"{API}/todos/{todo_id}") as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Todo deleted: {result['message']}")
            else:
                print(f"❌ Failed to delete todo: {response.status}")
        
        # Test 6: Verify deletion
        print("\n6. Verifying deletion...")
        async with session.get(f"{API}/todos/{todo_id}") as response:
            if response.status == 200:
                result = await response.json()
                if "error" in result:
                    print("✅ Todo successfully deleted (not found)")
                else:
                    print("❌ Todo still exists after deletion")
            else:
                print(f"Todo not found (as expected): {response.status}")

if __name__ == "__main__":
    asyncio.run(test_todo_api())