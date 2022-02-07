import {expect, test} from '@oclif/test'

describe('testInngThe', () => {
  test
  .stdout()
  .command(['testInngThe'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['testInngThe', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
