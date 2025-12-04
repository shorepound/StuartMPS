# Contributing

Thanks for contributing! This project follows a lightweight Git workflow to keep changes small and reviewable.

Branching
- Create a descriptive feature branch from `main`:
  - `git checkout -b feat/short-description`
  - `git checkout -b fix/issue-number`

Commits
- Make small, focused commits.
- Write clear commit messages (imperative present): "Add customer validation", "Fix login bug".

Migrations
- If you change EF Core models, create migrations locally and include them in your branch:

```bash
cd src/MovingApi
dotnet ef migrations add YourChange
git add src/MovingApi/Migrations
```

Pull requests
- Open a PR targeting `main` when your feature is ready.
- Include a short description of the change and any deployment/testing steps.
- Request a review from at least one maintainer.

Testing & Local dev
- Use `./scripts/start-all.sh` to start a local dev environment (Docker, migrations, backend, frontend).
- Verify the main flows: register, login, create/edit/delete customers (admin-only operations require seeding an admin user).

Code style
- Keep code idiomatic for the project platform:
  - C#: follow .NET naming and style conventions
  - TypeScript/React: use proper typing and functional components

License
- Check repository root for a `LICENSE` file before contributing code intended for public release.

Thanks — small, well-tested PRs make for fast reviews and safer merges.