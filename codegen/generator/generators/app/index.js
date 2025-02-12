import Generator from 'yeoman-generator'

const BASE_FOLDER = 'packages/govuk-frontend/src/govuk/components'

export default class extends Generator {
  async prompting() {
    const { name } = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message:
          'Write the name of the component in kebab-case (e.g., button or file-upload) and press Enter',
        required: true
      }
    ])

    this.govUKComponent = {
      name,
      folder: `${BASE_FOLDER}/${name}`
    }

    this.log('Component name:', this.govUKComponent.name)
    this.log('Folder:', this.govUKComponent.folder)
  }

  writing() {
    const { name, folder } = this.govUKComponent
    const pascalWithSpaces = this._toPascal(name, ' ')
    const pascalName = this._toPascal(name)

    const templates = [
      {
        source: 'README.md',
        destination: `${folder}/README.md`,
        context: { pascalWithSpaces, folder }
      },
      {
        source: '_component.scss',
        destination: `${folder}/_${name}.scss`,
        context: { folder }
      },
      {
        source: '_index.scss',
        destination: `${folder}/_index.scss`,
        context: { kebabName: name, folder }
      },
      {
        source: 'component.yaml',
        destination: `${folder}/${name}.yaml`,
        context: { kebabName: name, folder }
      },
      {
        source: 'macro.njk',
        destination: `${folder}/macro.njk`,
        context: { pascalName, folder }
      },
      {
        source: 'template.njk',
        destination: `${folder}/template.njk`,
        context: { folder }
      },
      {
        source: 'template.test.js',
        destination: `${folder}/template.test.js`,
        context: { kebabName: name, pascalWithSpaces, folder }
      }
    ]

    templates.forEach(({ source, destination, context }) => {
      this.fs.copyTpl(
        this.templatePath(source),
        this.destinationPath(destination),
        context
      )
    })
  }

  _toPascal(input, joinChar = '') {
    return input
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(joinChar)
  }
}
